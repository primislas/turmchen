package repository.inmemory

import model.Order
import repository.api.OrderRepository

case class InMemoryOrderRepository() extends InMemoryCrudRepository[Order] with OrderRepository {
  private val orders = InMemoryOrders

  override def create(entity: Order): Order = orders.create(entity)

  override def create(entities: Seq[Order]): Seq[Order] = orders.create(entities)

  override def read(id: Int): Option[Order] = orders.read(id)

  override def readAll(): Seq[Order] = orders.readAll()

  override def update(entity: Order): Order = orders.update(entity)

  override def delete(entity: Order): Boolean = orders.delete(entity)

  override def delete(id: Int): Boolean = orders.delete(id)

  override def nextId: Int = orders.nextId

  override def getOrdersForDay(day: Long): Seq[Order] = orders.getOrdersForDay(day)
}

object InMemoryOrders extends InMemoryCrudRepository[Order] with OrderRepository {
  override def getOrdersForDay(day: Long): Seq[Order] = readAll().filter(_.timestamp == day)
}