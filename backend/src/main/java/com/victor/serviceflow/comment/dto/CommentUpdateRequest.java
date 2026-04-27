package com.victor.serviceflow.comment.dto;

public record CommentUpdateRequest(
        String message,
        Long actorId
) {
}
