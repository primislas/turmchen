package model

import com.fasterxml.jackson.annotation.JsonProperty

case class Order
(override val id: Option[Int] = None,
 customerAlias: Option[String] = None,
 customer: Option[Customer] = None,
 timestamp: Long = 0L,
 items: Seq[OrderItem] = Seq.empty,
 paid: BigDecimal = BigDecimal(0))
extends PK[Int, Order](id) {
  override def apply(id: Option[Int]): Order = copy(id = id)

  // TODO oddly enough in this particular case overriden id val is missed by JsonMapper
  @JsonProperty("id")
  def getId: Option[Int] = id
}
