package com.sparta26.baemin.member.repository;

import com.sparta26.baemin.member.entity.Member;
import com.sparta26.baemin.member.entity.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long>, MemberRepositoryCustom {
    boolean existsByEmail(String email);

    Optional<Member> findByEmail(String email);

    Optional<Page<Member>> findAllByRole(Pageable pageable, UserRole role);

    Optional<Page<Member>> findAllByRoleAndIsPublic(Pageable pageable, UserRole userRole, boolean isPublic);
}
