package model

case class OrderItem
(override val id: Option[Int],
 dish: Dish,
 quantity: Int,
 price: BigDecimal
) extends PK[Int, OrderItem](id) {
  override def apply(id: Option[Int]): OrderItem = copy(id = id)
}
