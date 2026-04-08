package manga.dto;

public class LoginResponseDTO {

    private final String token;
    private final String tokenType = "Bearer";
    private final Integer id;
    private final String username;
    private final String email;
    private final String role;
    private final long expiresIn;

    public LoginResponseDTO(String token, Integer id, String username, String email, String role, long expiresIn) {
        this.token = token;
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
        this.expiresIn = expiresIn;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public Integer getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public long getExpiresIn() {
        return expiresIn;
    }
}
