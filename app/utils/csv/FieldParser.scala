package utils.csv

import java.time.DayOfWeek
import java.time.DayOfWeek._

import scala.util.Try
import scala.util.matching.Regex

sealed trait FieldParser[T] { self =>
  def eval(str: String): Option[T]
}
object StringParser extends FieldParser[String] {
  override def eval(str: String): Option[String] = Some(str)
}
object IntParser extends FieldParser[Int] {
  override def eval(str: String): Option[Int] = Try(str.toInt).toOption
}
object DecimalParser extends FieldParser[BigDecimal] {
  override def eval(str: String): Option[BigDecimal] = Try(BigDecimal(str.replace(',', '.'))).toOption
}
object BooleanParser extends FieldParser[Boolean] {
  override def eval(str: String): Option[Boolean] = Some(str.toBoolean)
}
object DayParser extends FieldParser[Set[DayOfWeek]] {
  override def eval(str: String): Option[Set[DayOfWeek]] = str.trim.toLowerCase match {
    case "пн" => Option(Set(MONDAY))
    case "вт" => Option(Set(TUESDAY))
    case "ср" => Option(Set(WEDNESDAY))
    case "чт" => Option(Set(THURSDAY))
    case "пт" => Option(Set(FRIDAY))
    case "все дни" => Option(Set(
      MONDAY,
      TUESDAY,
      WEDNESDAY,
      THURSDAY,
      FRIDAY))
    case _ => Option(Set.empty)
  }
}
object QuantityParser extends FieldParser[Int] {
  val qty: Regex = """(?<qty>\d+)?\s*(?<p>шт)""".r
  override def eval(str: String): Option[Int] = str match {
    case qty(items, _) => Option(items).map(_.toInt).orElse(Some(1))
    case _ => None
  }
}