package com.improvement_app.Security.security.services;

import com.improvement_app.Security.models.ERole;
import com.improvement_app.Security.models.Role;
import com.improvement_app.Security.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

//	@Autowired
//	UserRepository userRepository;

	@Autowired
	PasswordEncoder encoder;

	@Override
	@Transactional
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		//TODO: Podpiecie logowanie do bazy danych
//		User user = userRepository.findByUsername(username)
//				.orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));


//		public User(Long id, String username, String email, String password, Set< Role > roles)
		final Long id = 1L;
		final String username2 = "test";
		final String email = "test@test.pl";
		final String password = "test";

		Set<Role> roleSet = new HashSet<>();
		roleSet.add(new Role(ERole.ROLE_USER));
		roleSet.add(new Role(ERole.ROLE_ADMIN));

		User user = new User(id, username, email, encoder.encode(password), roleSet);

		return UserDetailsImpl.build(user);
	}

}
