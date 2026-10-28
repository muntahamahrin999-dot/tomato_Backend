package com.example.tomato.DTOs;

import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
public class RoleDTO {

    private String roleName;

    private String roleDescription;

    private OffsetDateTime dateCreated;

    private OffsetDateTime lastUpdated;
}