package repository.inmemory

import model.Dish
import repository.api.DishRepository
import utils.csv.CsvParser

import scala.io.Source

case class InMemoryDishRepository() extends InMemoryAliasCrudRepository[Dish] with DishRepository {

  private val dishes = InMemoryDishes

  override def create(entity: Dish): Dish = dishes.create(entity)

  override def findByAlias(alias: String): Option[Dish] = dishes.findByAlias(alias)

  override def create(entities: Seq[Dish]): Seq[Dish] = dishes.create(entities)

  override def read(id: Int): Option[Dish] = dishes.read(id)

  override def readAll(): Seq[Dish] = dishes.readAll()

  override def update(entity: Dish): Dish = dishes.update(entity)

  override def delete(entity: Dish): Boolean = dishes.delete(entity)

  override def delete(id: Int): Boolean = dishes.delete(id)

  override def nextId: Int = dishes.nextId

  override def idsByAlias(): Map[String, Int] = dishes.idsByAlias()
}

object InMemoryDishes extends InMemoryAliasCrudRepository[Dish] with DishRepository {
  create(CsvParser.apply(Source.fromResource("turmchen_menu.txt")("UTF-8").getLines().toSeq))
}