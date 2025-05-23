package com.improvement_app.googledrive.entity;

import com.google.api.services.drive.model.File;
import lombok.Data;

import java.io.Serializable;

@Data
public class DriveFileItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private String id;
    private String parentId;
    private String thumbnailLink;
    private String mimeType;

    public DriveFileItemDTO(File file) {
        this.name = file.getName();
        this.id = file.getId();
        this.mimeType = file.getMimeType();
    }

    public DriveFileItemDTO(String name, String id, String mimeType) {
        this.name = name;
        this.id = id;
        this.mimeType = mimeType;
    }
}
