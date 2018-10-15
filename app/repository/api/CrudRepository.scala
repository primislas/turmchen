package repository.api

import model.PK

trait CrudRepository[Id, T <: PK[Id, T]] {
  def create(entity: T): T
  def create(entities: Seq[T]): Seq[T]
  def read(id: Id): Option[T]
  def readAll(): Seq[T]
  def update(entity: T): T
  def delete(entity: T): Boolean
  def delete(id: Id): Boolean
}
