package lk.ijse.rayvora.service.impl;

import lk.ijse.rayvora.dto.CategoryDTO;
import lk.ijse.rayvora.dto.response.CategoryResponseDTO;
import lk.ijse.rayvora.entity.Category;
import lk.ijse.rayvora.enumeration.Status;
import lk.ijse.rayvora.exception.RayvoraException;
import lk.ijse.rayvora.repository.CategoryRepository;
import lk.ijse.rayvora.service.CategoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository categoryRepository;

    private String getExtension(String fileName) {
        if (fileName == null) {
            return "";
        }
        int index = fileName.lastIndexOf(".");
        if (index == -1) {
            return "";
        }
        return fileName.substring(index);
    }

    @Override
    public void saveCategory(CategoryDTO categoryDTO) {
        log.info("Execute saveCategory() dto {}", categoryDTO);
        try {
            Category category = new Category();
            category.setCategoryName(categoryDTO.getCategoryName());
            category.setDescription(categoryDTO.getDescription());

            MultipartFile image = categoryDTO.getImage();
            if (image == null || image.isEmpty()) {
                throw new RayvoraException(400, "Please upload a image");
            }

            String fileName = UUID.randomUUID() + getExtension(image.getOriginalFilename());
            Path uploadPath = Paths.get("uploads/images");

            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
            category.setImageUrl("/uploads/images/" + fileName);

            categoryRepository.save(category);

        } catch (IOException ie) {
            throw new RayvoraException(500, "Failed to save image");

        } catch (Exception e) {
            log.error("Error in saveCategory() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateCategory(CategoryDTO categoryDTO) {
        log.info("Execute updateCategory() dto {}", categoryDTO);
        try {
            Optional<Category> optionalCategory = categoryRepository.findById(categoryDTO.getCategoryId());
            if (optionalCategory.isEmpty())
                throw new RayvoraException(404, "Sorry, related category is not found!");

            Category category = optionalCategory.get();
            category.setCategoryName(categoryDTO.getCategoryName());
            category.setDescription(categoryDTO.getDescription());

            String oldImageUrl = category.getImageUrl();

            // Update new image
            MultipartFile image = categoryDTO.getImage();
            if (image == null || image.isEmpty()) {
                throw new RayvoraException(400, "Please upload a image");
            }

            String fileName = UUID.randomUUID() + getExtension(image.getOriginalFilename());
            Path uploadPath = Paths.get("uploads/images");

            Files.createDirectories(uploadPath);
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
            category.setImageUrl("/uploads/images/" + fileName);

            categoryRepository.save(category);

            // Delete old image
            if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                String oldFileName =
                            Paths.get(oldImageUrl)
                            .getFileName()
                            .toString();

                Path oldFilePath = uploadPath.resolve(oldFileName);
                Files.deleteIfExists(oldFilePath);
            }

        } catch (IOException ie) {
            throw new RayvoraException(500, "Failed to save image");

        } catch (Exception e) {
            log.error("Error in updateCategory() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public List<CategoryResponseDTO> getAllCategories() {
        log.info("Execute getAllCategories()");
        try {
            List<Category> categories = categoryRepository.findAll();
            List<CategoryResponseDTO> categoryDTOS =  new ArrayList<>();

            for (Category category : categories) {
                CategoryResponseDTO categoryDTO = new CategoryResponseDTO();
                categoryDTO.setCategoryId(category.getCategoryId());
                categoryDTO.setCategoryName(category.getCategoryName());
                categoryDTO.setDescription(category.getDescription());
                categoryDTO.setImageUrl(category.getImageUrl());
                categoryDTO.setStatus(category.getStatus());

                categoryDTOS.add(categoryDTO);
            }
            return categoryDTOS;

        } catch (Exception e) {
            log.error("Error in getAllCategories() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public CategoryResponseDTO getCategoryById(Long categoryId) {
        log.info("Execute getCategoryById() id {}", categoryId);
        try {
            Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isEmpty())
                throw new RayvoraException(404, "Sorry, related category is not found!");

            Category category = optionalCategory.get();
            CategoryResponseDTO categoryDTO = new CategoryResponseDTO();
            categoryDTO.setCategoryId(category.getCategoryId());
            categoryDTO.setCategoryName(category.getCategoryName());
            categoryDTO.setDescription(category.getDescription());
            categoryDTO.setImageUrl(category.getImageUrl());
            categoryDTO.setStatus(category.getStatus());

            return categoryDTO;

        } catch (Exception e) {
            log.error("Error in getCategoryById() : " + e.getMessage());
            throw e;
        }
    }

    @Override
    public void updateActiveStatus(Long categoryId) {
        log.info("Execute updateActiveStatus() id {}", categoryId);
        try {
            Optional<Category> optionalCategory = categoryRepository.findById(categoryId);
            if (optionalCategory.isEmpty())
                throw new RayvoraException(404, "Sorry, related category is not found!");

            Category category = optionalCategory.get();
            category.setStatus(Status.INACTIVE);

            categoryRepository.save(category);

        } catch (Exception e) {
            log.error("Error in updateActiveStatus() : " + e.getMessage());
            throw e;
        }
    }
}
