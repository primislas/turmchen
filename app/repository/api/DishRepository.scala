package repository.api

import com.google.inject.ImplementedBy
import model.Dish
import repository.inmemory.InMemoryDishRepository

@ImplementedBy(classOf[InMemoryDishRepository])
trait DishRepository extends WithAliasesRepository[Int, Dish] {
}
