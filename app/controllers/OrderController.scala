package controllers

import java.lang.System.currentTimeMillis
import java.time.DayOfWeek
import java.util.{Calendar, GregorianCalendar}

import javax.inject.{Inject, Singleton}
import model.{Order, OrderItem}
import play.api.mvc.{AbstractController, ControllerComponents}
import repository.api.{DishRepository, OrderRepository}
import utils.json.JsonMapper

import scala.Function.tupled
import scala.util.matching.Regex
import scala.util.{Failure, Success, Try}

@Singleton
class OrderController @Inject()
(
  cc: ControllerComponents,
  dishRepo: DishRepository,
  orderRepo: OrderRepository
) extends AbstractController(cc) {

  def getAllOrders = Action {
    val orders = orderRepo.readAll()
    Ok(JsonMapper.toJson(orders))
  }

  def getDailyOrders(day: Option[Long]) = Action {
    val orders = day.map(orderRepo.getOrdersForDay).getOrElse(orderRepo.readAll())
    Ok(JsonMapper.toJson(orders))
  }

  def getOrder(id: Int) = Action {
    orderRepo.read(id).map(o => Ok(JsonMapper.toJson(o))).getOrElse(NotFound)
  }

  def create = Action { request =>
    val order = JsonMapper.fromJson[Order](request.body.asJson.get.toString())
    Try(orderRepo.create(order)) match {
      case Success(created) => Ok(JsonMapper.toJson(created))
      case Failure(exception) => InternalServerError(JsonMapper.toJson(exception))
    }
  }

  def updateOrder(id: Int) = Action { request =>
    val order = JsonMapper.fromJson[Order](request.body.asJson.get.toString())
    Try(orderRepo.update(order)) match {
      case Success(created) => Ok(JsonMapper.toJson(created))
      case Failure(exception) => InternalServerError(JsonMapper.toJson(exception))
    }
  }

  def deleteOrder(id: Int) = Action {
    Try(orderRepo.delete(id)) match {
      case Success(_) => Ok("{}")
      case Failure(exception) => InternalServerError(JsonMapper.toJson(exception))
    }
  }

  def parseOrder() = Action { request =>
    val order = request.body.asText.get
    Try(parseOrderStr(order)) match {
      case Success(created: Order) => Ok(JsonMapper.toJson(created))
      case Failure(exception) => InternalServerError(JsonMapper.toJson(exception))
    }
  }

  def parseOrderStr(str: String): Order = {
    val lines = str.split('\n').map(_.trim).filter(!_.isEmpty)

    val customerAlias = lines.flatMap(parseCustomerAlias).headOption.map(_.alias).orElse(lines.headOption)
    val orderItems = lines
      .map(_.toLowerCase)
      .map(_.replaceAll("(?:\\s+|\\x{A0}+)+", " "))
      .flatMap(parseOrderItem)
//      .groupBy(_.dish.id)
//      .mapValues(items => items.reduce((a1, a2) => a1.copy(quantity = a1.quantity + a2.quantity)))
//      .values.toSeq
    val dayTimestamp = lines.map(_.toLowerCase).flatMap(parseDay).headOption.getOrElse(nextDay)

    Order(customerAlias = customerAlias, timestamp = dayTimestamp, items = orderItems)
  }

  val customerPattern: Regex = """(?<alias>.*){1},\s+(?<hours>\d{1,2}):(?<minutes>\d{1,2})(?: [A|P]M)?$""".r

  def parseCustomerAlias(str: String): Option[ParsedCustomer] = str match {
    case customerPattern(alias, hr, min) => Some(ParsedCustomer(alias, hr.toInt, min.toInt))
    case _ => None
  }

  def parseDay(str: String): Option[Long] = {
    val dayOfWeek = if (str.contains("понедельник")) Some(DayOfWeek.MONDAY)
    else if (str.contains("вторник")) Some(DayOfWeek.TUESDAY)
    else if (str.contains("среда")) Some(DayOfWeek.WEDNESDAY)
    else if (str.contains("четверг")) Some(DayOfWeek.THURSDAY)
    else if (str.contains("пятница")) Some(DayOfWeek.FRIDAY)
    else None

    dayOfWeek.map(d => {
      val cal = new GregorianCalendar()
      cal.setTimeInMillis(currentTimeMillis())
      val next = d.getValue
      val today = cal.get(Calendar.DAY_OF_WEEK)
      val adjusted = if (next <= today) next - today + 7 else next - today
      val ms = cal.getTimeInMillis + adjusted * msInDay
      day(ms)
    })
  }

  val qtyPattern: Regex = """(?<qty>\d+)\s*шт""".r.unanchored
  val suffixPattern: Regex = """\s+(?:x|х)?(?<qty>\d{1})$""".r.unanchored

  def parseOrderItem(str: String): Option[OrderItem] = {
    val quantity = str match {
      case qtyPattern(qty) => qty.toInt
      case suffixPattern(qty) => qty.toInt
      case _ => 1
    }
    val lowerCase = str.toLowerCase
    dishRepo.idsByAlias()
      .find(tupled((alias, _) => lowerCase == alias))
        .orElse(dishRepo.idsByAlias().find(tupled((alias, _) => lowerCase.contains(alias))))
        .orElse(dishRepo.idsByAlias().find(tupled((alias, _) => alias.contains(lowerCase))))
        .flatMap(tupled((_, id) => dishRepo.read(id)))
        .map(dish => {
          val price = dish.price.map(_ * BigDecimal(quantity)).getOrElse(BigDecimal(0))
          OrderItem(None, dish, quantity, price)
        })
  }

  val msInDay: Long = 60 * 60 * 24 * 1000L

  def nextDay: Long = {
    val cal = new GregorianCalendar()
    cal.setTimeInMillis(currentTimeMillis())
    val today = cal.get(Calendar.DAY_OF_WEEK)
    val next = if (today >= 5) 1 else today + 1
    val adjusted = if (next <= today) next - today + 7 else next - today
    val ms = cal.getTimeInMillis + adjusted * msInDay
    day(ms)
  }

  def day(ms: Long): Long = ms  - ms % 86400000

  case class ParsedCustomer(alias: String, hours: Int, minutes: Int) {
    def date: Long = {
      val cal = new GregorianCalendar()
      cal.setTimeInMillis(currentTimeMillis())
      val today = cal.get(Calendar.DAY_OF_WEEK)
      val next = if (today >= 5) 1 else today + 1
      val adjusted = if (next <= today) next - today + 7 else next - today
      val ms = cal.getTimeInMillis + adjusted * msInDay
      day(ms)
    }
  }

}
