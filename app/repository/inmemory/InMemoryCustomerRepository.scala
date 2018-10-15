package repository.inmemory

import model.Customer
import repository.api.CustomerRepository

case class InMemoryCustomerRepository() extends InMemoryAliasCrudRepository[Customer] with CustomerRepository {
  private val customers = InMemoryCustomers

  override def create(entity: Customer): Customer = customers.create(entity)

  override def findByAlias(alias: String): Option[Customer] = customers.findByAlias(alias)

  override def create(entities: Seq[Customer]): Seq[Customer] = customers.create(entities)

  override def read(id: Int): Option[Customer] = customers.read(id)

  override def readAll(): Seq[Customer] = customers.readAll()

  override def update(entity: Customer): Customer = customers.update(entity)

  override def delete(entity: Customer): Boolean = customers.delete(entity)

  override def delete(id: Int): Boolean = customers.delete(id)

  override def nextId: Int = customers.nextId
}

object InMemoryCustomers extends InMemoryAliasCrudRepository[Customer] with CustomerRepository