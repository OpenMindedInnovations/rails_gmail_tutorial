require File.expand_path('../boot', __FILE__)

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module TodoApp
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true

    config.middleware.insert_before 0, "Rack::Cors" do
      allow do
        origins '*','chrome-extension://ibfdlibfkoemoeapebafdgnhpngjahho'
        resource '*', :headers => :any, :methods => [:get, :post, :options, :delete, :put, :patch], credentials: true
      end
    end
  end
end
