package com.victor.serviceflow.comment.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long authorId,
        String authorName,
        String message,
        Boolean internal,
        LocalDateTime createdAt
) {
}
