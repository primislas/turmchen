name := """zoral-teremok"""
organization := "com.zoral"

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.12.6"

libraryDependencies += guice
libraryDependencies += "org.scalatestplus.play" %% "scalatestplus-play" % "3.1.2" % Test withSources()
libraryDependencies += "com.fasterxml.jackson.module" %% "jackson-module-scala" % "2.8.8" withSources() withJavadoc()

// Adds additional packages into Twirl
//TwirlKeys.templateImports += "com.zoral.controllers._"

// Adds additional packages into conf/routes
// play.sbt.routes.RoutesKeys.routesImport += "com.zoral.binders._"
