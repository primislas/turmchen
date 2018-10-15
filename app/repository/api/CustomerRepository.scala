package repository.api

import com.google.inject.ImplementedBy
import model.Customer
import repository.inmemory.InMemoryCustomerRepository

@ImplementedBy(classOf[InMemoryCustomerRepository])
trait CustomerRepository extends WithAliasesRepository[Int, Customer]