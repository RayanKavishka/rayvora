package lk.ijse.rayvora.service;

import lk.ijse.rayvora.dto.CategoryDTO;
import lk.ijse.rayvora.dto.response.CategoryResponseDTO;

import java.util.List;

public interface CategoryService {
    void saveCategory(CategoryDTO categoryDTO);
    void updateCategory(CategoryDTO categoryDTO);
    List<CategoryResponseDTO> getAllCategories();
    CategoryResponseDTO getCategoryById(Long categoryId);
    void updateActiveStatus(Long categoryId);
}
