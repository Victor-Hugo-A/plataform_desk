package com.victor.serviceflow.comment;

import com.victor.serviceflow.comment.dto.CommentRequest;
import com.victor.serviceflow.comment.dto.CommentResponse;
import com.victor.serviceflow.comment.dto.CommentUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CommentResponse create(@RequestBody CommentRequest request) {
        return commentService.create(request);
    }

    @GetMapping("/ticket/{ticketId}")
    public List<CommentResponse> findByTicketId(@PathVariable Long ticketId) {
        return commentService.findByTicketId(ticketId);
    }

    @PatchMapping("/{id}")
    public CommentResponse update(@PathVariable Long id, @RequestBody CommentUpdateRequest request) {
        return commentService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @RequestParam Long actorId) {
        commentService.delete(id, actorId);
    }
}
