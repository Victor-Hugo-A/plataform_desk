package com.victor.serviceflow.comment.dto;

public record CommentRequest(
        Long ticketId,
        Long authorId,
        String message,
        Boolean internal
) {
}