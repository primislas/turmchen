package repository.inmemory

import model.PK
import repository.api.CrudRepository

import scala.collection.mutable
import scala.util.Try

abstract class InMemoryCrudRepository[T <: PK[Int, T]] extends CrudRepository[Int, T] {

  private var idCounter: Int = Try(readAll().flatMap(_.id).max).getOrElse(0)
  private val entities: mutable.Map[Int, T] = mutable.TreeMap()

  override def create(entity: T): T = {
    val id = nextId
    val e = entity.apply(Some(id))
    entities.put(id, e)
    e
  }

  override def create(entities: Seq[T]): Seq[T] = {
    entities.foreach(create)
    readAll()
  }

  override def read(id: Int): Option[T] = entities.get(id)

  override def readAll(): Seq[T] = entities.values.toSeq

  override def update(entity: T): T = {
    entity.id.foreach(entities.put(_, entity))
    entity
  }

  override def delete(entity: T): Boolean = entity.id.flatMap(entities.remove).isDefined

  override def delete(id: Int): Boolean = entities.remove(id).isDefined

  def nextId: Int = {
    idCounter = idCounter + 1
    idCounter
  }
}
