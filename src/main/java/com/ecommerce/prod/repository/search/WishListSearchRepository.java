package com.ecommerce.prod.repository.search;

import com.ecommerce.prod.domain.WishList;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link WishList} entity.
 */
public interface WishListSearchRepository extends ElasticsearchRepository<WishList, Long> {
}
