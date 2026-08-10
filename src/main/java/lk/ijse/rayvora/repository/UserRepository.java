package lk.ijse.rayvora.repository;

import lk.ijse.rayvora.dto.UserDTO;
import lk.ijse.rayvora.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<lk.ijse.rayvora.entity.User> findByUserName(String userName);
    Boolean existsByUserName(String userName);
    Boolean existsByEmail(String email);
    Boolean existsByContact(String contact);
}
