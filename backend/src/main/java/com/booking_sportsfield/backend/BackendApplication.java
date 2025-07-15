package com.booking_sportsfield.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.booking_sportsfield.backend.entity.User;
import com.booking_sportsfield.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner seedAdminUser(UserRepository userRepository) {
		return args -> {
			String adminEmail = "admin";
			if (!userRepository.existsByEmail(adminEmail)) {
				User admin = new User();
				admin.setEmail(adminEmail);
				admin.setFullName("Admin User");
				admin.setPassword(new BCryptPasswordEncoder().encode("admin"));
				admin.setEnabled(true);
				admin.setRole(User.Role.ADMIN);
				userRepository.save(admin);
				System.out.println("Admin user created: admin/admin");
			}
		};
	}
}
