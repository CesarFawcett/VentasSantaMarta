package com.santamarta.api.config;

import com.santamarta.api.models.Category;
import com.santamarta.api.models.Product;
import com.santamarta.api.repositories.CategoryRepository;
import com.santamarta.api.repositories.ProductRepository;
import com.santamarta.api.repositories.UserRepository;
import com.santamarta.api.models.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Creando usuario administrador inicial...");
            User admin = new User();
            admin.setEmail("admin@santamarta.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrador Principal");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
        }

        if (productRepository.count() > 0) {
            log.info("La base de datos ya tiene productos. Omitiendo seed de productos.");
            return;
        }

        log.info("Poblando base de datos con productos iniciales...");

        // Crear categorías
        Category artesanias = categoryRepository.save(
            Category.builder().name("Artesanías").icon("🪡").build()
        );
        Category gastronomia = categoryRepository.save(
            Category.builder().name("Gastronomía").icon("☕").build()
        );
        Category moda = categoryRepository.save(
            Category.builder().name("Moda").icon("👒").build()
        );
        Category frutas = categoryRepository.save(
            Category.builder().name("Frutas Tropicales").icon("🥥").build()
        );

        // Crear productos
        productRepository.save(Product.builder()
            .name("Mochila Arhuaca Tradicional")
            .description("Tejida a mano por artesanas de la Sierra Nevada con lana virgen de oveja. Cada mochila lleva consigo un símbolo de la cosmovisión Arhuaca.")
            .price(new BigDecimal("180000"))
            .stock(15)
            .imageUrl("https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800")
            .isPromotion(true)
            .discountPercentage(18)
            .category(artesanias)
            .build());

        productRepository.save(Product.builder()
            .name("Café Orgánico Sierra Nevada")
            .description("Café de especialidad cultivado en las faldas de la Sierra Nevada a 1800 metros sobre el nivel del mar. Notas de chocolate oscuro y frutas rojas.")
            .price(new BigDecimal("45000"))
            .stock(50)
            .imageUrl("https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=800")
            .isPromotion(true)
            .discountPercentage(20)
            .category(gastronomia)
            .build());

        productRepository.save(Product.builder()
            .name("Sombrero Vueltiao Premium")
            .description("El ícono cultural de Colombia tejido en palma de iraca con detalle fino. Declarado Patrimonio Cultural. 24 vueltas, calidad exportación.")
            .price(new BigDecimal("120000"))
            .stock(10)
            .imageUrl("https://images.unsplash.com/photo-1596455607563-ad6193f76b17?auto=format&fit=crop&q=80&w=800")
            .isPromotion(false)
            .discountPercentage(0)
            .category(moda)
            .build());

        productRepository.save(Product.builder()
            .name("Coco Seco Premium (Pack x3)")
            .description("Cocos orgánicos secos cosechados en Minca y Taganga. Perfectos para uso gastronómico o decoración natural.")
            .price(new BigDecimal("25000"))
            .stock(100)
            .imageUrl("https://images.unsplash.com/photo-1584306679116-6799f91cd027?auto=format&fit=crop&q=80&w=800")
            .isPromotion(false)
            .discountPercentage(0)
            .category(frutas)
            .build());

        productRepository.save(Product.builder()
            .name("Collar de Semillas Naturales")
            .description("Elaborado con semillas recolectadas en los bosques de la Sierra. Diseño inspirado en los patrones Kogi y pintado con tintas naturales.")
            .price(new BigDecimal("35000"))
            .stock(30)
            .imageUrl("https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800")
            .isPromotion(false)
            .discountPercentage(0)
            .category(artesanias)
            .build());

        productRepository.save(Product.builder()
            .name("Ron Artesanal de Caña")
            .description("Ron local producido con caña de azúcar cultivada en la zona bananera del Magdalena. Añejado en barrica de roble por 3 años.")
            .price(new BigDecimal("65000"))
            .stock(20)
            .imageUrl("https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=800")
            .isPromotion(true)
            .discountPercentage(10)
            .category(gastronomia)
            .build());

        productRepository.save(Product.builder()
            .name("Manilla Wayúu Bicolor")
            .description("Pulsera tejida por mujeres Wayúu en la Guajira. Colores vivos con patrones geométricos representativos de cada clan familiar.")
            .price(new BigDecimal("15000"))
            .stock(75)
            .imageUrl("https://images.unsplash.com/photo-1611010344444-5f9e4d86a6d8?auto=format&fit=crop&q=80&w=800")
            .isPromotion(false)
            .discountPercentage(0)
            .category(artesanias)
            .build());

        productRepository.save(Product.builder()
            .name("Mango de Azúcar Premium")
            .description("Mangos de Azúcar 100% orgánicos del Magdalena, reconocidos como los mejores del mundo por su sabor dulce sin fibra.")
            .price(new BigDecimal("18000"))
            .stock(200)
            .imageUrl("https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&q=80&w=800")
            .isPromotion(true)
            .discountPercentage(15)
            .category(frutas)
            .build());

        log.info("✅ Base de datos poblada con {} productos.", productRepository.count());
    }
}
