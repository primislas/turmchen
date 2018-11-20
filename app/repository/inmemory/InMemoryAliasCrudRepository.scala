package repository.inmemory

import model.Aliases

import scala.collection.immutable.ListMap
import scala.collection.mutable

abstract class InMemoryAliasCrudRepository[T <: Aliases[Int, T]]
  extends InMemoryCrudRepository[T] {

  private val byAlias: mutable.Map[String, T] = new mutable.LinkedHashMap[String, T]()

  //readAll().foreach(e => e.aliases.foreach(a => byAlias.put(a.toLowerCase, e)))

  override def create(entity: T): T = {
    if (entity.aliases.intersect(byAlias.keySet).nonEmpty)
      throw new RuntimeException(s"Entities with aliases [${entity.aliases}] already exist.")
    val withId = super.create(entity)
    withId.aliases.foreach(byAlias.put(_, withId))
    withId
  }

  def findByAlias(alias: String): Option[T] = byAlias.get(alias.toLowerCase)

  def findByAliases(aliases: Seq[String]): Seq[T] = aliases.flatMap(findByAlias)

  def idsByAlias(): Map[String, Int] = {
    val idByAlias = byAlias.toSeq.flatMap(at => at._2.id.map(id => (at._1, id)))
    ListMap(idByAlias: _*)
  }

}