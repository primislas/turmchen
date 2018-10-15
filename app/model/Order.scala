package model

case class Order
(override val id: Option[Int] = None,
 customerAlias: Option[String] = None,
 customer: Option[Customer] = None,
 timestamp: Long = 0L,
 items: Seq[OrderItem] = Seq.empty,
 paid: BigDecimal = BigDecimal(0))
extends PK[Int, Order](id) {
  override def apply(id: Option[Int]): Order = copy(id = id)
}
