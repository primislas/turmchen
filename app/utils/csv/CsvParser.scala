package utils.csv

import model.{Aliases, Dish}
import utils.csv.KnownTags._

import Function.tupled

object CsvParser {

  def apply(csv: String): Seq[Dish] = apply(csv.lines.toSeq)

  def apply(lines: Seq[String]): Seq[Dish] = {
    val nonEmpty = lines.filter(!_.isEmpty)
    val fieldsByIndex = nonEmpty.take(1).flatMap(toCsvFields)
      .filter(csvField => KnownTags.contains(csvField.id))
      .groupBy(_.idx)
      .mapValues(_.head.id)

    def lineToDish(s: String): Option[Dish] = {
      val fields = s.split("\t").toSeq
      val fieldsByTag = fields.zipWithIndex
        .flatMap(tupled((s: String, idx: Int) => fieldsByIndex.get(idx).map(id => (id, s)))(_))
        .groupBy(_._1).mapValues(_.head._2)

      def evalField[T](tag: String, fp: FieldParser[T]) = fieldsByTag.get(tag).flatMap(fp.eval)

      val dishName = evalField(name, StringParser)
      val dishAlias = dishName.map(Aliases.nameToAlias).toSet
      val dishPrice = evalField(price, DecimalParser)
      val dishSchedule = evalField(day, DayParser).getOrElse(Set.empty)
      val dishCategories = evalField(category, StringParser).toSet
      val dishDescr = evalField(description, StringParser).filter(!_.isEmpty)
      val dishWeight = evalField(weight, DecimalParser)
      val dishQty = evalField(quantity, QuantityParser)

      if (dishName.isDefined && dishPrice.isDefined && dishSchedule.nonEmpty)
        Option(Dish(None, dishName, dishDescr, dishAlias, dishCategories, dishPrice, dishSchedule, dishWeight, dishQty))
      else
        None
    }

    nonEmpty.drop(1).flatMap(lineToDish)
  }

  def toCsvFields(headers: String): Seq[FieldConfig] =
    headers.split("\t").zipWithIndex.map(si => FieldConfig(si._1, si._2))

}

case class FieldConfig(id: String, idx: Int)

case object KnownTags {
  val name = "name"
  val price = "price"
  val day = "day"
  val description = "description"
  val category = "category"
  val weight = "weight"
  val quantity = "quantity"

  private val knownTags = Set(name, price, day, description, category, weight, quantity)

  def contains(s: String): Boolean = knownTags.contains(s)
}
