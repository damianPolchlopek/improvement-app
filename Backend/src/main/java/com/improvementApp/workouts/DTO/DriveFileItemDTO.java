package com.improvementApp.workouts.DTO;

import com.google.api.services.drive.model.File;

import java.io.Serializable;

public class DriveFileItemDTO implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private String id;
    private String parentId;
    private String thumbnailLink;

    public DriveFileItemDTO(File file) {
        this.name = file.getName();
        this.id = file.getId();
        this.mimeType = file.getMimeType();
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    private String mimeType;

    public static long getSerialVersionUID() {
        return serialVersionUID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getThumbnailLink() {
        return thumbnailLink;
    }

    public void setThumbnailLink(String thumbnailLink) {
        this.thumbnailLink = thumbnailLink;
    }
}
