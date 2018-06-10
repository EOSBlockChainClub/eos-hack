#include <eosiolib/eosio.hpp>
#include <eosiolib/print.hpp>
#include "drate.hpp"
using namespace eosio;
using namespace drate;

namespace drate {
struct impl {
		public:
			/**
		    * @param create - action to be applied
		    */
			void on(const create& c) {
			  // Put code for create action here
				require_auth(c.code_account);
				// eosio_assert(c.challenger != c.host, "challenger shouldn't be the same as host");
				print("checkpoint");
				// // Check if game already exists
				rates existing_rates(N(chantaman),N(chantaman));
				// auto itr = existing_drates.find( c.username );
				// eosio_assert(itr == existing_drates.end(), "rate record already exists");

				// drate existing_drates(code_account, c.username);
				// drate drate(c.code_account, c.review_desc, c.review_date, c.transaction_date, c.transaction_amount, c.product_name, c.username);
				existing_rates.emplace(N(chantaman), [&]( auto& g ) {
					  g.user_account = c.code_account;
				 	  g.review_desc = c.review_desc;
					  g.review_date = c.review_desc;
					  g.transaction_date = c.transaction_date;
					  g.transaction_amount = c.transaction_amount;
					  g.product_name = c.product_name;
					  g.username = c.username;
					  g.rating = c.rating;
				});
			}

		   /// The apply method implements the dispatch of events to this contract
		   void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
		      // Put your action handler here

				if (code == receiver) {
					if (action == N(create)) {
					impl::on(eosio::unpack_action_data<create>());
					} else {

					}
			
				}
		   }


};
}

extern "C" {

   using namespace drate;
   /// The apply method implements the dispatch of events to this contract
   void apply( uint64_t receiver, uint64_t code, uint64_t action ) {
      impl().apply(receiver, code, action);
   }

} // extern "C"
