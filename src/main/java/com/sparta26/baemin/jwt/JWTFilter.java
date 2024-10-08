package com.sparta26.baemin.jwt;

import io.jsonwebtoken.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 *  JWT토큰 유효성 검증 필터
 */
@Slf4j
@Component
public class JWTFilter extends OncePerRequestFilter {
	@Value("${jwt.key}")
	private String ymlKey;
	private final JWTUtil jwtUtil;

	public JWTFilter(JWTUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}


	/**
	 * jwt 토큰 검증 필터
	 * @param req
	 * @param res
	 * @param filterChain
	 * @throws ServletException
	 * @throws IOException
	 */
	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {


			try{
				String tokenValue = req.getHeader("Authorization");
				if(tokenValue == null || !tokenValue.startsWith("Bearer ") || tokenValue.isEmpty()){
					throw new SecurityException("토큰이 없습니다.");
				}
				tokenValue = jwtUtil.substringToken(tokenValue);
				jwtUtil.validateToken(tokenValue);
				Claims claims = jwtUtil.getUserInfoFromToken(tokenValue);
				Long id = ((Integer) claims.get("id")).longValue();
				String username = String.valueOf(claims.get("email"));
				String role = (String) claims.get("role");

				ForContext context = new ForContext(id, username, role);

				CustomUserDetails customUserDetails = new CustomUserDetails(context);
				Authentication authToken = new UsernamePasswordAuthenticationToken(customUserDetails, null,
						customUserDetails.getAuthorities());


				SecurityContextHolder.getContext().setAuthentication(authToken);
				logger.info("[인중 가 통과]: "+username+" endpoint: "+req.getRequestURI());
			}catch (SecurityException | MalformedJwtException | SignatureException e) {
				logger.error("Invalid JWT signature, 유효하지 않는 JWT 서명 입니다.");
				req.setAttribute("exception", e);
			} catch (ExpiredJwtException e) {
				logger.error("Expired JWT token, 만료된 JWT token 입니다.");
				req.setAttribute("exception", e);
			} catch (UnsupportedJwtException e) {
				logger.error("Unsupported JWT token, 지원되지 않는 JWT 토큰 입니다.");
				req.setAttribute("exception", e);
			} catch (IllegalArgumentException e) {
				logger.error("JWT claims is empty, 잘못된 JWT 토큰 입니다.");
				req.setAttribute("exception", e);
			}
			catch (Exception e) {
				logger.error("JWT claims is empty, 잘못된 JWT 토큰 입니다.");
				req.setAttribute("exception", e);
			}
			finally {
				filterChain.doFilter(req, res);
			}


	}

	@Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
    	if( request.getServletPath().equals("/v1/signUp")) {
    		return true;
    	}
    	else if( request.getServletPath().equals("/v1/logIn")) {
    		return true;
    	}
    	else {
    		return false;
    	}
    }

}
