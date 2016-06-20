# encoding: utf-8

class ApiUploader < CarrierWave::Uploader::Base
  attr_accessor :success_action_redirect
  attr_accessor :success_action_status

  %w{ key aws_access_key_id acl policy signature }.each do |method|
    define_method method do 
      method
    end
  end

  def direct_fog_url
    "/api/uploads/asset"
  end

end

