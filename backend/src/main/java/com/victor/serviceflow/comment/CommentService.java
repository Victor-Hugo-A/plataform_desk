package com.victor.serviceflow.comment;

import com.victor.serviceflow.comment.dto.CommentRequest;
import com.victor.serviceflow.comment.dto.CommentResponse;
import com.victor.serviceflow.comment.dto.CommentUpdateRequest;
import com.victor.serviceflow.exception.BusinessException;
import com.victor.serviceflow.exception.ResourceNotFoundException;
import com.victor.serviceflow.ticket.Ticket;
import com.victor.serviceflow.ticket.TicketRepository;
import com.victor.serviceflow.user.User;
import com.victor.serviceflow.user.UserRepository;
import com.victor.serviceflow.user.UserRole;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository
    ) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse create(CommentRequest request) {
        Ticket ticket = ticketRepository.findById(request.ticketId())
                .orElseThrow(() -> new ResourceNotFoundException("Chamado nao encontrado."));

        User author = findUser(request.authorId());

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setMessage(request.message());
        comment.setInternal(request.internal() != null ? request.internal() : false);

        return toResponse(commentRepository.save(comment));
    }

    public List<CommentResponse> findByTicketId(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CommentResponse update(Long id, CommentUpdateRequest request) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario nao encontrado."));

        User actor = findUser(request.actorId());
        validateCommentPermission(comment, actor);
        comment.setMessage(request.message());

        return toResponse(commentRepository.save(comment));
    }

    public void delete(Long id, Long actorId) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comentario nao encontrado."));

        User actor = findUser(actorId);
        validateCommentPermission(comment, actor);
        commentRepository.delete(comment);
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado."));
    }

    private void validateCommentPermission(Comment comment, User actor) {
        boolean isAuthor = comment.getAuthor().getId().equals(actor.getId());
        boolean isAdmin = actor.getRole() == UserRole.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new BusinessException("Voce nao tem permissao para alterar este comentario.", HttpStatus.FORBIDDEN);
        }
    }

    private CommentResponse toResponse(Comment comment) {
        return new CommentResponse(
                comment.getId(),
                comment.getAuthor().getId(),
                comment.getAuthor().getName(),
                comment.getMessage(),
                comment.getInternal(),
                comment.getCreatedAt()
        );
    }
}
