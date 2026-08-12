package lk.ijse.rayvora.controller;

import jakarta.validation.Valid;
import lk.ijse.rayvora.constant.CommonResponse;
import lk.ijse.rayvora.constant.ResponseCode;
import lk.ijse.rayvora.constant.ResponseMessage;
import lk.ijse.rayvora.dto.CategoryDTO;
import lk.ijse.rayvora.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    // admin only
    @PostMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse saveCategory(@Valid @ModelAttribute CategoryDTO categoryDTO) {
        categoryService.saveCategory(categoryDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // admin only
    @PutMapping(
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse updateCategory(@Valid @ModelAttribute CategoryDTO categoryDTO) {
        categoryService.updateCategory(categoryDTO);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getAllCategories() {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                categoryService.getAllCategories(),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    @GetMapping(value = "/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse getCategoryById(@PathVariable long categoryId) {
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                categoryService.getCategoryById(categoryId),
                ResponseMessage.SUCCESS_MESSAGE
        );
    }

    // admin only
    @DeleteMapping(value = "/{categoryId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public CommonResponse updateActiveStatus(@PathVariable long categoryId) {
        categoryService.updateActiveStatus(categoryId);
        return new CommonResponse(
                ResponseCode.OPERATION_SUCCESS,
                ResponseMessage.SUCCESS_MESSAGE
        );
    }
}
