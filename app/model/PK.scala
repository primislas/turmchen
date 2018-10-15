package model

abstract class PK[Key, +T <: PK[Key, T]](val id: Option[Key]) {
  def apply(id: Option[Key]): T
}
