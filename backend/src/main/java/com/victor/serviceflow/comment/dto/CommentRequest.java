package com.victor.serviceflow.comment.dto;

public record CommentRequest(
        Long ticketId,
        String message,
        Boolean internal,
        Long authorId
) {
}
