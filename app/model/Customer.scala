package model

case class Customer
(override val id: Option[Int],
 firstName: Option[String] = None,
 lastName: Option[String] = None,
 override val aliases: Set[String] = Set.empty
) extends Aliases[Int, Customer](id, aliases)
{
  def apply(id: Option[Int]): Customer = copy(id = id)
  def apply(id: Option[Int], aliases: Set[String]): Customer = copy(id = id, aliases = aliases)
}
