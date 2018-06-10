
#include <eosiolib/eosio.hpp>
#include <eosiolib/action.h>
#include <eosiolib/print.hpp>

#include <iostream>
#include <string>

using namespace eosio;




namespace drate {

	static const account_name code_account = N(drate);

	static const account_name rate_account = N(rates);

	/// @abi table ratestable i64
	struct rate {
	  // rate() {}
	  // rate(
	  // 	  account_name		user_account,
		 //  std::string		review_desc,
		 //  std::string		review_date,
		 //  std::string		transaction_date,
		 //  std::string		transaction_amount,
		 //  std::string		product_name,
		 //  std::string		username
	  // ) {}

	  // account_name     challenger;
	  // account_name     host;
	  // account_name     turn; // = account name of host/ challenger
	  // account_name     winner = N(none); // = none/ draw/ account name of host/ challenger
	  // uint8_t          board[9]; //

	  // uint64_t			id;
	  account_name		user_account;
	  std::string		review_desc;
	  std::string		review_date;
	  std::string		transaction_date;
	  std::string		transaction_amount;
	  std::string		product_name;
	  std::string		username;
	  std::string		rating;

	  // // Initialize board with empty cell
	  // void initialize_board() {
	  //    for (uint8_t i = 0; i < board_len ; i++) {
	  //       board[i] = 0;
	  //    }
	  // }

	  // // Reset game
	  // void reset_game() {
	  //    initialize_board();
	  //    turn = host;
	  //    winner = N(none);
	  // }


	  

	  uint64_t primary_key() const { return user_account; }

	  EOSLIB_SERIALIZE( rate, (user_account)(review_desc)(review_date)(transaction_date)(transaction_amount)(product_name)(username)(rating) )
	};

	typedef eosio::multi_index< N(ratestable), rate> rates;

	/// @abi action 
	struct create {
      account_name   	code_account;
      std::string		review_desc;
	  std::string		review_date;
	  std::string		transaction_date;
	  std::string		transaction_amount;
	  std::string		product_name;
	  std::string		username;
	  std::string		rating;

      EOSLIB_SERIALIZE( create, (code_account)(review_desc)(review_date)(transaction_date)(transaction_amount)(product_name)(username)(rating) )
    };

};