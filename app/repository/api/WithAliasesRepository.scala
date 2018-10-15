package repository.api

import model.PK

trait WithAliasesRepository[Id, T <: PK[Id, T]] extends CrudRepository[Id, T] {
  def findByAlias(alias: String): Option[T]
  def findByAliases(aliases: Seq[String]): Seq[T]
  def idsByAlias(): Map[String, Id]
}
