package com.ecommerce.prod.repository;

import com.ecommerce.prod.domain.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Category entity.
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query(value = "select distinct category from Category category left join fetch category.products",
        countQuery = "select count(distinct category) from Category category")
    Page<Category> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct category from Category category left join fetch category.products")
    List<Category> findAllWithEagerRelationships();

    @Query("select category from Category category left join fetch category.products where category.id =:id")
    Optional<Category> findOneWithEagerRelationships(@Param("id") Long id);

}
