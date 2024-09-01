package com.sparta26.baemin.member.repository;

import com.sparta26.baemin.dto.member.RequestSearchMemberDto;
import com.sparta26.baemin.dto.member.ResponseMemberInfoDto;
import com.sparta26.baemin.dto.product.RequestSearchProductDto;
import com.sparta26.baemin.dto.product.ResponseProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MemberRepositoryCustom {
    Page<ResponseMemberInfoDto> findAllMember(Pageable pageable, RequestSearchMemberDto condition);
}
