package utils.csv

import org.scalatestplus.play.PlaySpec

import scala.io.Source

class CsvParserSpec extends PlaySpec {

  "CsvParser" should {


    "parse tab-separated menu" in {
      val menuFile = Source.fromResource("turmchen_menu.txt").getLines().toSeq
      val dishes = CsvParser.apply(menuFile)
      println(s"Retrieved ${dishes.size} dishes")
    }

  }


}
