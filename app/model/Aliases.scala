package model

abstract class Aliases[Key, T <: Aliases[Key, T]]
(override val id: Option[Key], val aliases: Set[String] = Set.empty)
  extends PK[Key, T](id) { self =>

  def apply(id: Option[Key], next: Set[String]): T

  def is(alias: String): Boolean = aliases.exists(_.contains(alias))

  def addAlias(alias: String): T = {
    val next = aliases + alias

    if (next.size == aliases.size) self.asInstanceOf[T]
    else apply(id, next)
  }

}
