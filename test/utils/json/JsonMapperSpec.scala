package utils.json

import model.{Dish, Order, OrderItem}
import org.scalatestplus.play.PlaySpec

class JsonMapperSpec extends PlaySpec {

  "JsonMapper" should {

    "serialize order id" in {
      val dish = Dish(Some(1), Some(""))
      val orderItem = OrderItem(None, dish, 2, BigDecimal(0))
      val order = Order(Some(1), Some("Constantine"), None, 0L, Seq(orderItem), BigDecimal(0))
      val json = JsonMapper.toJson(order)
      println(json)
    }


  }

}
