package controllers

import javax.inject._
import play.api.mvc._
import repository.api.DishRepository
import utils.json.JsonMapper

import scala.util.Try

/**
  * Frontend controller managing all static resource associate routes.
  * @param cc Controller components reference.
  */
@Singleton
class DishController @Inject()
(
  cc: ControllerComponents,
  dishRepository: DishRepository
) extends AbstractController(cc) {

  def getAllDishes = Action {
    println("Fetching all dishes...")
    val dishes = dishRepository.readAll()
    Ok(JsonMapper.toJson(dishes))
  }

  def getDish(id: String) = Action {
    Try(id.toInt).toOption
      .map(dishRepository.read).map(JsonMapper.toJson)
      .map(Ok(_)).getOrElse(NotFound)
  }

}