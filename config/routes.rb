TranslateApp::Application.routes.draw do
  get "hardcode/new"
  post "hardcode/add"
  get "hardcode/view"
  get "hardcode/delete"
  get "hardcode/newquiz"
  post "hardcode/addquiz"
  get "hardcode/viewquiz"
  get "hardcode/deletequiz"

  resources :users
  resources :dictionaries
  
  
  root to: 'translates#index'
  #match '/articleContents', to: 'translates#paragraphs_in_article', via: :get
  match '/show', to: 'translates#show_by_bing', via: :post
  match '/showbybing', to: 'translates#show_by_bing', via: :post
  match '/remember', to: 'translates#remember', via: :get
  match '/getQuiz', to: 'translates#quiz', via: :get
  match '/getNumber', to: 'translates#calculate', via: :get
  match '/displayHistory', to: 'users#displayHistory', via: :get
  match '/settings', to: 'users#settings', via: :get
  match '/getIfTranslate', to: 'users#getIfTranslate', via: :get
  match '/getSuggestURL', to: 'users#getSuggestURL', via: :get
  match '/getExampleSentences', to: 'translates#getExampleSentences', via: :get
  match '/log', to: 'users#log', via: :post

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
