package com.sparta26.baemin.member.service;

import com.sparta26.baemin.dto.member.RequestLogInDto;
import com.sparta26.baemin.dto.member.RequestSignUpDto;
import com.sparta26.baemin.dto.member.ResponseMemberToProductDto;
import com.sparta26.baemin.exception.exceptionsdefined.LoginFailException;
import com.sparta26.baemin.exception.exceptionsdefined.MemberNotFoundException;
import com.sparta26.baemin.jwt.JWTUtil;
import com.sparta26.baemin.member.entity.Member;
import com.sparta26.baemin.member.entity.UserRole;
import com.sparta26.baemin.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private  final JWTUtil jwtUtil;

    @Transactional
    public Member createMember(RequestSignUpDto member){
        UserRole role = UserRole.fromString(member.getRoleCode());
        Member user;
        if(memberRepository.existsByEmail(member.getEmail())){
            throw new DuplicateKeyException("이미 가입한 이메일 입니다.");
        }
        user = Member.builder()
                .email(member.getEmail())
                .password(passwordEncoder.encode(member.getPassword()))
                .username(member.getUsername())
                .nickname(member.getNickname())
                .role(role)
                .build();
        return memberRepository.save(user);
    }

    public String attemptLogIn(RequestLogInDto member) {
        Member db_member = memberRepository.findByEmail(member.getEmail())
                .orElseThrow(() -> new LoginFailException("Member not found with email: " + member.getEmail()));
        // 비번 비교 로직
        String token = null;
        if(passwordEncoder.matches(member.getPassword(), db_member.getPassword())){
            token = jwtUtil.createToken(db_member.getId(),db_member.getEmail(),db_member.getRole());
        }else{
            throw new LoginFailException("이메일이나 비밀번호가 틀렸습니다.");
        }
        return token;
    }

    /**
     * Product 통신을 위한 메서드
     * @param memberId
     * @return
     */
    public ResponseMemberToProductDto findByIdfromProduct(Long memberId) {
        Member findMember = memberRepository.findById(memberId).orElseThrow(() ->
                new MemberNotFoundException("not found member"));
        return ResponseMemberToProductDto.toDto(findMember);
    }
}
