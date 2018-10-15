package repository.api

import com.google.inject.ImplementedBy
import model.Order
import repository.inmemory.InMemoryOrderRepository

@ImplementedBy(classOf[InMemoryOrderRepository])
trait OrderRepository extends CrudRepository[Int, Order] {
  def getOrdersForDay(day: Long): Seq[Order]
}
