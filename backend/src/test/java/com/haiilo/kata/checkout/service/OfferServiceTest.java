package com.haiilo.kata.checkout.service;

import com.haiilo.kata.checkout.model.Offer;
import com.haiilo.kata.checkout.repository.OfferRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OfferService")
class OfferServiceTest {

    @Mock
    private OfferRepository offerRepository;

    @InjectMocks
    private OfferService offerService;

    private Offer activeOffer1;
    private Offer activeOffer2;
    private Offer inactiveOffer;

    @BeforeEach
    void setUp() {
        activeOffer1 = new Offer("offer1", "A", 3, new BigDecimal("2.50"), true);
        activeOffer2 = new Offer("offer2", "B", 2, new BigDecimal("0.80"), true);
        inactiveOffer = new Offer("offer3", "C", 4, new BigDecimal("3.00"), false);
    }

    @Nested
    @DisplayName("getActiveOffers")
    class GetActiveOffers {

        @Test
        @DisplayName("should return only active offers")
        void shouldReturnOnlyActiveOffers() {
            when(offerRepository.findAll()).thenReturn(Arrays.asList(activeOffer1, activeOffer2, inactiveOffer));

            List<Offer> activeOffers = offerService.getActiveOffers();

            assertThat(activeOffers).hasSize(2);
            assertThat(activeOffers).containsExactly(activeOffer1, activeOffer2);
            assertThat(activeOffers).allMatch(Offer::isActive);
            verify(offerRepository).findAll();
        }

        @Test
        @DisplayName("should return empty list when no active offers exist")
        void shouldReturnEmptyListWhenNoActiveOffersExist() {
            when(offerRepository.findAll()).thenReturn(Collections.singletonList(inactiveOffer));

            List<Offer> activeOffers = offerService.getActiveOffers();

            assertThat(activeOffers).isEmpty();
            verify(offerRepository).findAll();
        }

        @Test
        @DisplayName("should return empty list when no offers exist")
        void shouldReturnEmptyListWhenNoOffersExist() {
            when(offerRepository.findAll()).thenReturn(Collections.emptyList());

            List<Offer> activeOffers = offerService.getActiveOffers();

            assertThat(activeOffers).isEmpty();
            verify(offerRepository).findAll();
        }

        @Test
        @DisplayName("should return all offers when all are active")
        void shouldReturnAllOffersWhenAllAreActive() {
            when(offerRepository.findAll()).thenReturn(Arrays.asList(activeOffer1, activeOffer2));

            List<Offer> activeOffers = offerService.getActiveOffers();

            assertThat(activeOffers).hasSize(2);
            verify(offerRepository).findAll();
        }
    }
}

