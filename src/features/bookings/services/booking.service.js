/**
 * Routes form data to the correct API request shape based on ServiceType.
 *
 * @param {string} type
 * @param {object} formData
 * @param {import('@/shared/types/models').User} user
 * @returns {object} API request body
 */
export function buildBookingPayload(type, formData, user) {
  const payload = {
    type,
    total_amount: formData.total_amount || 0,
    currency: formData.currency || (user?.tier === 'international' ? 'USD' : 'KES'),
  };

  // Nest specific fields based on service type
  switch (type) {
    case 'safari':
      payload.safari = {
        package_id: formData.package_id,
        travel_date: formData.travel_date,
        party_size: Number(formData.party_size),
        tier_applied: user?.tier || 'citizen',
        season_applied: formData.season_applied || 'regular',
      };
      break;

    case 'sgr_transfer':
    case 'flight':
      payload.transfer = {
        pickup_location: formData.pickup_location,
        dropoff_location: formData.dropoff_location,
        pickup_time: formData.pickup_time,
        vehicle_type: formData.vehicle_type,
        flight_or_train_number: formData.flight_or_train_number || null,
      };
      break;

    case 'delivery':
      payload.delivery = {
        sender_address: formData.sender_address,
        recipient_name: formData.recipient_name,
        recipient_phone: formData.recipient_phone,
        delivery_address: formData.delivery_address,
        parcel_weight_kg: formData.parcel_weight_kg ? Number(formData.parcel_weight_kg) : null,
        delivery_instructions: formData.delivery_instructions || null,
      };
      break;

    case 'hotel':
      payload.hotel = {
        hotel_name: formData.hotel_name,
        room_category: formData.room_category,
        check_in: formData.check_in,
        check_out: formData.check_out,
        number_of_rooms: Number(formData.number_of_rooms),
      };
      break;

    case 'event':
      payload.event = {
        event_name: formData.event_name,
        event_type: formData.event_type,
        venue_name: formData.venue_name,
        event_date: formData.event_date,
        estimated_attendees: Number(formData.estimated_attendees),
      };
      break;

    default:
      break;
  }

  return payload;
}

