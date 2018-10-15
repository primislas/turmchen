package model

import java.time.DayOfWeek

case class Dish
(override val id: Option[Int] = None,
 name: Option[String],
 description: Option[String] = None,
 override val aliases: Set[String] = Set.empty,
 categories: Set[String] = Set.empty,
 price: Option[BigDecimal] = None,
 schedule: Set[DayOfWeek] = Set.empty,
 weight: Option[BigDecimal] = None,
 quantity: Option[Int] = None
) extends Aliases[Int, Dish](id, aliases) {
  def apply(id: Option[Int]): Dish = copy(id = id)
  def apply(id: Option[Int], aliases: Set[String]): Dish = copy(id = id, aliases = aliases)
}

