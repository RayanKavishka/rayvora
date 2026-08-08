package lk.ijse.rayvora.config;

import lk.ijse.rayvora.entity.User;
import lk.ijse.rayvora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUserName("admin")) {
            User admin = new User();
            admin.setUserName("admin");
            admin.setPassword(passwordEncoder.encode("admin2004"));
            admin.setUserRoles("ADMIN, SELLER, CUSTOMER");
            admin.setFirstName("Rayan");
            admin.setLastName("Kavishka");
            admin.setEmail("rayanofficial2004@gmail.com");
            admin.setContact("0773956439");

            userRepository.save(admin);
        }
    }
}
